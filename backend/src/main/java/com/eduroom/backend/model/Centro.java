package com.eduroom.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "centros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Centro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private LocalTime horarioInicio = LocalTime.of(8, 15);
    private LocalTime horarioFin = LocalTime.of(14, 45);

    @OneToMany(mappedBy = "centro", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"centro", "passwordHash"})
    private List<Usuario> usuarios;

    @OneToMany(mappedBy = "centro", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("centro")
    private List<Aula> aulas;
}