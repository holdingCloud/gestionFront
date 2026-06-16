import { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { CompanyService } from '../../../services';
import { Company } from '../../../interfaces/company.interface';

interface Props {
    value: number | undefined;
    onChange: (id: number | undefined) => void;
}

export const CompanySelect = ({ value, onChange }: Props) => {
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        CompanyService.getCompanies().then(setCompanies).catch(() => {});
    }, []);

    return (
        <FormControl fullWidth size="small">
            <InputLabel>Empresa</InputLabel>
            <Select
                value={value ?? ''}
                onChange={(e: SelectChangeEvent) => {
                    const v = e.target.value;
                    onChange(v === '' ? undefined : Number(v));
                }}
                label="Empresa"
            >
                <MenuItem value="">Todas</MenuItem>
                {companies.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
