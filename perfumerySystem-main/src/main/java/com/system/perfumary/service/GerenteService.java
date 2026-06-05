package com.system.perfumary.service;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.system.perfumary.entity.Gerente;
import com.system.perfumary.entity.Promocao;
import com.system.perfumary.enums.NivelAcesso;
import com.system.perfumary.repository.GerenteRepository;

@Service
public class GerenteService {
    private final GerenteRepository gerenteRepository;
    private final PromocaoService promocaoService;

    public GerenteService(GerenteRepository gerenteRepository, PromocaoService promocaoService) {
        this.gerenteRepository = gerenteRepository;
        this.promocaoService = promocaoService;
    }

    public void cadastrarGerente(String nome, String email, String senha) {
        Gerente gerente = new Gerente();
        gerente.setNome(nome);
        gerente.setEmail(email);
        gerente.setSenha(senha);
        gerente.setNivelAcesso(NivelAcesso.GERENTE);
        gerenteRepository.save(gerente);
    }

    public void alterarSenhaGerente(Long id, String novaSenha) {
        Gerente gerente = gerenteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gerente não encontrado"));
        gerente.setSenha(novaSenha);
        gerenteRepository.save(gerente);
    }

    public Gerente atualizarPromocao(Long promocaoId, String nome, double desconto, Date dataInicio, Date dataFim) {
        promocaoService.atualizar(promocaoId, nome, desconto, dataInicio, dataFim);
        return null; // A controller vai buscar o gerente atualizado
    }

    public Gerente buscarPorId(Long id) {
        return gerenteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gerente não encontrado"));
    }

    public void excluirGerente(Long id) {
        gerenteRepository.deleteById(id);
    }

    public Gerente cadastrarPromocao(
        Long gerenteId,
        String nome,
        double desconto,
        Date dataInicio,
        Date dataFim) {

        Gerente gerente = gerenteRepository
                .findById(gerenteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gerente não encontrado"));

        if (gerente.getPromocoes() == null) {
            gerente.setPromocoes(new ArrayList<>());
        }

        Promocao promocao = promocaoService.criarPromocao(
                nome,
                desconto,
                dataInicio,
                dataFim);

        gerente.getPromocoes().add(promocao);

        return gerenteRepository.save(gerente);
    }

    public Gerente deletarPromocao(Long gerenteId, Long promocaoId) {
        Gerente gerente = gerenteRepository
                .findById(gerenteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gerente não encontrado"));

        Promocao promocao = gerente.getPromocoes()
                .stream()
                .filter(p -> p.getId().equals(promocaoId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Promoção não encontrada"));

        gerente.getPromocoes().remove(promocao);
        promocaoService.excluirPromocao(promocaoId);

        return gerenteRepository.save(gerente);
    }
}
