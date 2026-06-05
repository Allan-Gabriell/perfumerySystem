package com.system.perfumary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.system.perfumary.entity.Vendedor;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
}
