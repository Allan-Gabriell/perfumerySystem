package com.system.perfumary.dto;

import lombok.Data;

@Data
public class ItemVendaRequest {
    private Long produtoId;
    private Integer quantidade;
}
