package com.system.perfumary.controller;

import org.springframework.web.bind.annotation.*;

import com.system.perfumary.dto.AlterarSenhaRequest;
import com.system.perfumary.dto.GerenteRequest;
import com.system.perfumary.dto.PromocaoRequest;
import com.system.perfumary.entity.Gerente;
import com.system.perfumary.service.GerenteService;

@RestController
@RequestMapping("/gerentes")
public class GerenteController {

    private final GerenteService gerenteService;

    public GerenteController(GerenteService gerenteService) {
        this.gerenteService = gerenteService;
    }

    @PostMapping("/cadastrar-gerente")
    public String cadastrarGerente(@RequestBody GerenteRequest request) {

        gerenteService.cadastrarGerente(
                request.getNome(),
                request.getEmail(),
                request.getSenha()
        );

        return "Gerente cadastrado com sucesso!";
    }

    @PostMapping("/{id}/promocoes")
    public Gerente cadastrarPromocao(
        @PathVariable Long id,
        @RequestBody PromocaoRequest request) {

        return gerenteService.cadastrarPromocao(
                id,
                request.getNome(),
                request.getDesconto(),
                request.getDataInicio(),
                request.getDataFim()
        );
    }

    @PutMapping("/{id}/alterar-senha")
    public String alterarSenhaGerente(
        @PathVariable Long id,
        @RequestBody AlterarSenhaRequest request) {

        gerenteService.alterarSenhaGerente(id, request.getNovaSenha());

        return "Senha alterada com sucesso!";
    }

    @DeleteMapping("/{id}/deletar")
    public String excluirGerente(@PathVariable Long id) {
        gerenteService.excluirGerente(id);
        return "Gerente excluído com sucesso!";
    }


    @DeleteMapping("/{gerenteId}/promocoes/{promocaoId}")
    public String deletarPromocao(
            @PathVariable Long gerenteId,
            @PathVariable Long promocaoId) {

        gerenteService.deletarPromocao(
                gerenteId,
                promocaoId);
        return "Promoção deletada com sucesso!";
    }
}