package com.udani.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String nic;
    private LocalDate dob;
    private String gender;
    private String phone;
    private String address;
    private List<VisitDto> visits;
}
