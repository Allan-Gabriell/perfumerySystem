package com.system.perfumary.entity;

import java.util.Date;
import java.util.List;

import com.system.perfumary.enums.TipoRelatorio;

public class Relatorio {
    private int id;
    private TipoRelatorio tipo;
    private Date datainicio;
    private Date datafim;
    private List<Promocao> promocoes;
    

    public void gerarRelatorio(TipoRelatorio tipo, Date datainicio, Date datafim) {
        return;
    }
}
