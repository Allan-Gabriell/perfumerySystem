package com.system.perfumary.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.system.perfumary.entity.Vendedor;
import com.system.perfumary.enums.NivelAcesso;
import com.system.perfumary.repository.VendedorRepository;

@Service
public class VendedorService {
    private final VendedorRepository repository;

    public VendedorService(VendedorRepository repository) {
        this.repository = repository;
    }

    public Vendedor cadastrar(String nome, String email, String senha) {
        Vendedor vendedor = new Vendedor();
        vendedor.setNome(nome);
        vendedor.setEmail(email);
        vendedor.setSenha(senha);
        vendedor.setNivelAcesso(NivelAcesso.VENDEDOR);
        return repository.save(vendedor);
    }

    public List<Vendedor> listarTodos() {
        return repository.findAll();
    }

    public Vendedor buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Vendedor não encontrado"));
    }

    public void alterarSenha(Long id, String novaSenha) {
        Vendedor vendedor = buscarPorId(id);
        vendedor.setSenha(novaSenha);
        repository.save(vendedor);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
