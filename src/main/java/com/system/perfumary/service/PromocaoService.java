package com.system.perfumary.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.system.perfumary.entity.Promocao;
import com.system.perfumary.repository.PromocaoRepository;

@Service
public class PromocaoService {

    private final PromocaoRepository repository;

    public PromocaoService(PromocaoRepository repository) {
        this.repository = repository;
    }

    public Promocao criarPromocao(String nome, double desconto, Date dataInicio, Date dataFim) {
        Promocao promocao = new Promocao(nome, desconto, dataInicio, dataFim);
        return repository.save(promocao);
    }

    public void excluirPromocao(Long id) {
        repository.deleteById(id);
    }

    public Promocao buscarPromocao(Long id) {
        return repository.findById(id).orElse(null);
    }
}
