package com.example.meatshop.config;

import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.meatshop.models.Product;
import com.example.meatshop.enums.AnimalType;
import com.example.meatshop.enums.ProductCategory;
import com.example.meatshop.repositories.ProductRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            // Seed Ribeye Steak
            Product ribeye = new Product();
            ribeye.setName("Dry-Aged Ribeye Steak");
            ribeye.setPrice(new BigDecimal("28.50"));
            ribeye.setCategory(ProductCategory.BEEF_RIB);
            ribeye.setAnimalType(AnimalType.BEEF);
            ribeye.setDescription("Richly marbled, grass-fed beef ribeye cut. Wet-aged 21 days for absolute flavor and tenderness.");
            ribeye.setImageUrl("/ribeye.png");
            productRepository.save(ribeye);

            // Seed Pork Chops
            Product porkChops = new Product();
            porkChops.setName("Berkshire Thick Pork Chops");
            porkChops.setPrice(new BigDecimal("18.90"));
            porkChops.setCategory(ProductCategory.PORK_CHOP);
            porkChops.setAnimalType(AnimalType.PORK);
            porkChops.setDescription("Heritage Berkshire breed pork chops. Bone-in, double-thick cut for juiciness on the grill.");
            porkChops.setImageUrl("/porkchops.png");
            productRepository.save(porkChops);

            // Seed Chicken Breast
            Product chickenBreast = new Product();
            chickenBreast.setName("Pasture-Raised Chicken Breast");
            chickenBreast.setPrice(new BigDecimal("12.50"));
            chickenBreast.setCategory(ProductCategory.CHICKEN_BREAST);
            chickenBreast.setAnimalType(AnimalType.CHICKEN);
            chickenBreast.setDescription("Organic, free-range chicken breasts. Air-chilled to preserve texture, high protein, and moisture.");
            chickenBreast.setImageUrl("/chicken.png");
            productRepository.save(chickenBreast);

            // Seed Ground Beef
            Product groundBeef = new Product();
            groundBeef.setName("Wagyu Ground Beef");
            groundBeef.setPrice(new BigDecimal("22.00"));
            groundBeef.setCategory(ProductCategory.MINCE_BEEF);
            groundBeef.setAnimalType(AnimalType.BEEF);
            groundBeef.setDescription("Premium Japanese Wagyu beef mince. Perfect 80/20 fat ratio for rich, buttery homemade burgers.");
            groundBeef.setImageUrl("/groundbeef.png");
            productRepository.save(groundBeef);

            System.out.println("Data Seeding: Seeded 4 premium starter meat products successfully.");
        }
    }
}
