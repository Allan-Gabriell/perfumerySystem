package com.system.perfumary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.system.perfumary.entity.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
