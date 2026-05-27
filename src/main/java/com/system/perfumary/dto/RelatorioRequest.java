package com.system.perfumary.dto;

import java.util.Date;
import com.system.perfumary.enums.TipoRelatorio;
import lombok.Data;

@Data
public class RelatorioRequest {
    private TipoRelatorio tipo;
    private Date dataInicio;
    private Date dataFim;
    private Long gerenteId;
}
