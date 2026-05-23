package com.system.perfumary.entity;

import com.system.perfumary.enums.NivelAcesso;

import jakarta.persistence.*;
import lombok.*;

@MappedSuperclass
@Getter
@Setter
public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    
    @Enumerated(EnumType.STRING)
    private NivelAcesso nivelAcesso;

    public void realizarCadastro(String nome, String email, String senha, NivelAcesso nivelAcesso) {
        return;
    }

    public void realizarLogin(String email, String senha) {
        return;
    }

    public void alterarSenha(String novaSenha) {
        return;
    }
}
