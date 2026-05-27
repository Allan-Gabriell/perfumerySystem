package com.system.perfumary.dto;

import com.system.perfumary.enums.NivelAcesso;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsuarioRequest {
    @NotBlank
    private String nome;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String senha;
    
    private NivelAcesso nivelAcesso;
}
