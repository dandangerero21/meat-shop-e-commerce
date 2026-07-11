package com.example.meatshop.services;

import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;
import java.util.Optional;
import com.example.meatshop.models.Product;
import com.example.meatshop.repositories.ProductRepository;
import com.example.meatshop.enums.AnimalType;
import com.example.meatshop.enums.ProductCategory;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // create
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // read
    public Optional<Product> findById(UUID id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getProductsByAnimalType(AnimalType animalType) {
        return productRepository.findByAnimalType(animalType);
    }

    public List<Product> getProductsByNameContainingIgnoreCase(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // update
    public Product updateProduct(UUID id, Product productDetails) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product existingProduct = product.get();
            existingProduct.setName(productDetails.getName());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setCategory(productDetails.getCategory());
            existingProduct.setAnimalType(productDetails.getAnimalType());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setImageUrl(productDetails.getImageUrl());
            return productRepository.save(existingProduct);
        } else {
            throw new RuntimeException("Product not found");
        }
    }

    // delete
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepository.delete(product);
    }
}