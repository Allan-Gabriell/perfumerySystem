package com.system.perfumary.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import com.system.perfumary.entity.Relatorio;
import com.system.perfumary.dto.RelatorioRequest;
import com.system.perfumary.service.RelatorioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {
    private final RelatorioService service;

    public RelatorioController(RelatorioService service) {
        this.service = service;
    }

    @PostMapping
    public Relatorio salvar(@Valid @RequestBody RelatorioRequest request) {
        return service.salvarRelatorio(request);
    }

    @GetMapping
    public List<Relatorio> listar() {
        return service.listarTodos();
    }

    @GetMapping("/vendas")
    public Map<String, Object> gerarRelatorioVendas() {
        return service.gerarRelatorioVendas();
    }

    @GetMapping("/produtos")
    public Map<String, Object> gerarRelatorioProdutos() {
        return service.gerarRelatorioProdutos();
    }
}
