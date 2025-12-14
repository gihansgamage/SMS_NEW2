package lk.ac.pdn.sms.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocietyId implements Serializable {
    private String societyName;
    private Integer year;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SocietyId societyId = (SocietyId) o;
        return Objects.equals(societyName, societyId.societyName) &&
                Objects.equals(year, societyId.year);
    }

    @Override
    public int hashCode() {
        return Objects.hash(societyName, year);
    }
}