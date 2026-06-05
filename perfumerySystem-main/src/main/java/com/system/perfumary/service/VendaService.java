package com.system.perfumary.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.system.perfumary.dto.ItemVendaRequest;
import com.system.perfumary.dto.VendaRequest;
import com.system.perfumary.entity.Cliente;
import com.system.perfumary.entity.ItemVenda;
import com.system.perfumary.entity.Produto;
import com.system.perfumary.entity.Venda;
import com.system.perfumary.entity.Vendedor;
import com.system.perfumary.entity.Promocao;
import com.system.perfumary.repository.ClienteRepository;
import com.system.perfumary.repository.ProdutoRepository;
import com.system.perfumary.repository.VendaRepository;
import com.system.perfumary.repository.VendedorRepository;

@Service
public class VendaService {
    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final VendedorRepository vendedorRepository;
    private final ProdutoRepository produtoRepository;

    public VendaService(VendaRepository vendaRepository, ClienteRepository clienteRepository, 
                        VendedorRepository vendedorRepository, ProdutoRepository produtoRepository) {
        this.vendaRepository = vendaRepository;
        this.clienteRepository = clienteRepository;
        this.vendedorRepository = vendedorRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public Venda registrarVenda(VendaRequest request) {
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Vendedor vendedor = vendedorRepository.findById(request.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor não encontrado"));

        Venda venda = new Venda();
        venda.setCliente(cliente);
        venda.setVendedor(vendedor);
        venda.setData(new Date());
        venda.setItens(new ArrayList<>());

        double valorTotal = 0.0;

        for (ItemVendaRequest itemReq : request.getItens()) {
            Produto produto = produtoRepository.findById(itemReq.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemReq.getProdutoId()));

            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setQuantidade(itemReq.getQuantidade());
            item.setVenda(venda);

            double precoFinal = produto.getPreco();
            Promocao promocao = produto.getPromocao();
            
            if (promocao != null) {
                Date agora = new Date();
                if (agora.after(promocao.getDataInicio()) && agora.before(promocao.getDataFim())) {
                    precoFinal = precoFinal * (1 - (promocao.getDesconto() / 100.0));
                }
            }

            double subtotal = precoFinal * itemReq.getQuantidade();
            item.setSubtotal(subtotal);
            venda.getItens().add(item);
            valorTotal += subtotal;
        }

        venda.setValorTotal(valorTotal);
        return vendaRepository.save(venda);
    }

    @Transactional
    public Venda atualizarVenda(Long id, VendaRequest request) {
        Venda venda = buscarPorId(id);
        
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Vendedor vendedor = vendedorRepository.findById(request.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor não encontrado"));

        venda.setCliente(cliente);
        venda.setVendedor(vendedor);
        venda.getItens().clear();

        double valorTotal = 0.0;
        for (ItemVendaRequest itemReq : request.getItens()) {
            Produto produto = produtoRepository.findById(itemReq.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setQuantidade(itemReq.getQuantidade());
            item.setVenda(venda);

            double precoFinal = produto.getPreco();
            Promocao promocao = produto.getPromocao();
            if (promocao != null) {
                Date agora = new Date();
                if (agora.after(promocao.getDataInicio()) && agora.before(promocao.getDataFim())) {
                    precoFinal = precoFinal * (1 - (promocao.getDesconto() / 100.0));
                }
            }

            double subtotal = precoFinal * itemReq.getQuantidade();
            item.setSubtotal(subtotal);
            venda.getItens().add(item);
            valorTotal += subtotal;
        }

        venda.setValorTotal(valorTotal);
        return vendaRepository.save(venda);
    }

    public List<Venda> listarTodas() {
        return vendaRepository.findAll();
    }

    public Venda buscarPorId(Long id) {
        return vendaRepository.findById(id).orElseThrow(() -> new RuntimeException("Venda não encontrada"));
    }

    public void deletar(Long id) {
        vendaRepository.deleteById(id);
    }
}
