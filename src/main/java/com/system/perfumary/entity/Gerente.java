package com.system.perfumary.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "gerente")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Gerente extends Usuario {

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "gerente_id")
    private List<Promocao> promocoes;
}
