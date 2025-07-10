import { Toolbar, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TIKTOK_COLORS = {
  background: '#121212',
  surface: '#222327',
  accent: '#FE2C55',
  blue: '#25F4EE',
  text: '#fff',
  textSecondary: '#aaa',
  border: '#393939',
};

interface BeerTopBarProps {
  type: string;
  setType: (type: string) => void;
}

const BeerTopBar = ({ type, setType }: BeerTopBarProps) => (
  <Toolbar style={{
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
    background: TIKTOK_COLORS.surface,
    borderRadius: 8,
    border: `1px solid ${TIKTOK_COLORS.border}`,
    color: TIKTOK_COLORS.text,
    boxShadow: '0 2px 8px 0 #0002'
  }}>
    <Typography variant="h6" style={{ fontWeight: 900, color: TIKTOK_COLORS.accent, letterSpacing: 2 }}>
      BeerTok
    </Typography>
    <FormControl size="small" style={{ minWidth: 120, background: TIKTOK_COLORS.background, borderRadius: 4 }}>
      <InputLabel id="type-label" style={{ color: TIKTOK_COLORS.textSecondary }}>Type</InputLabel>
      <Select
        labelId="type-label"
        value={type}
        label="Type"
        onChange={e => setType(e.target.value)}
        style={{ color: TIKTOK_COLORS.text }}
        MenuProps={{
          PaperProps: {
            style: { background: TIKTOK_COLORS.surface, color: TIKTOK_COLORS.text }
          }
        }}
      >
        <MenuItem value="ale">Ale</MenuItem>
        <MenuItem value="stouts">Stouts</MenuItem>
      </Select>
    </FormControl>
  </Toolbar>
);

export default BeerTopBar;