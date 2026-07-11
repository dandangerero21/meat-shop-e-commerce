package com.example.meatshop.repositories;

import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.meatshop.models.Product;
import com.example.meatshop.enums.AnimalType;
import com.example.meatshop.enums.ProductCategory;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByAnimalType(AnimalType animalType);

    List<Product> findByCategory(ProductCategory category);

}
