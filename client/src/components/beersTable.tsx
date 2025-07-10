import { useEffect, useState, useRef, useCallback } from 'react';
import API from '../api/api';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, CircularProgress } from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';

import BeerTopBar from './BeerTopBar';

interface IBeer {
    price: string;
    name: string;
    rating: {
        average: number;
        reviews: number;
    };
    image: string;
    id: number;
    [key: string]: any;
}

const PAGE_SIZE = 10;

const TIKTOK_COLORS = {
  background: '#121212',
  surface: '#222327',
  accent: '#FE2C55',
  blue: '#25F4EE',
  text: '#fff',
  textSecondary: '#aaa',
  border: '#393939',
};

const beersTable = () => {
  const [beers, setBeers] = useState<IBeer[]>([]);
  const [type, setType] = useState<string>('ale');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedBeer, setEditedBeer] = useState<IBeer>({} as IBeer);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchBeers = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const response = await API.get<{ beers: IBeer[] }>(
        `/beers/${type}?limit=${PAGE_SIZE}&offset=${reset ? 0 : page * PAGE_SIZE}`
      );
      const fetchedBeers = response.data?.beers ?? [];
      if (reset) {
        setBeers(fetchedBeers);
      } else {
        setBeers(prev => [...prev, ...fetchedBeers]);
      }
      setHasMore(fetchedBeers.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching beers:', error);
      if (reset) setBeers([]);
    } finally {
      setLoading(false);
    }
  }, [type, page]);

  useEffect(() => {
    setPage(0);
    fetchBeers(true);
    // eslint-disable-next-line
  }, [type]);

  useEffect(() => {
    if (page === 0) return;
    fetchBeers();
    // eslint-disable-next-line
  }, [page]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || loading || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        setPage(prev => prev + 1);
      }
    };
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, hasMore]);

  const handleEdit = (beer: IBeer) => {
    setEditingId(beer.id);
    setEditedBeer({ ...beer });
  };

  const handleSave = async (id: number) => {
    setBeers(beers.map(b => b.id === id ? editedBeer : b));
    setEditingId(null);
    setEditedBeer({} as IBeer);
  };

  const handleDelete = async (id: number) => {
    setBeers(beers.filter(b => b.id !== id));
  };

  const renderCell = (beer: IBeer, key: string) => {
    if (key === 'id') return beer[key];
    // Handle nested rating object
    if (key === 'rating') {
      return editingId === beer.id ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField
            label="Reviews"
            type="number"
            value={editedBeer.rating?.reviews ?? ''}
            onChange={e =>
              setEditedBeer({
                ...editedBeer,
                rating: {
                  ...editedBeer.rating,
                  reviews: Number(e.target.value),
                },
              })
            }
            size="small"
            style={{ width: 90, background: TIKTOK_COLORS.surface, borderRadius: 4 }}
          />
          <TextField
            label="Avg"
            type="number"
            value={editedBeer.rating?.average ?? ''}
            onChange={e =>
              setEditedBeer({
                ...editedBeer,
                rating: {
                  ...editedBeer.rating,
                  average: Number(e.target.value),
                },
              })
            }
            size="small"
            style={{ width: 70, background: TIKTOK_COLORS.surface, borderRadius: 4 }}
          />
        </div>
      ) : (
        <div style={{ color: TIKTOK_COLORS.text, display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span>
            Reviews: <span style={{ color: TIKTOK_COLORS.accent }}>{beer.rating?.reviews ?? '-'}</span>
          </span>
          <span>
            Avg: <span style={{ color: TIKTOK_COLORS.blue }}>{beer.rating?.average ?? '-'}</span>
          </span>
        </div>
      );
    }
    // Show image for 'image' column
    if (key === 'image') {
      return (
        <img
          src={beer.image}
          alt={beer.name}
          style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, background: TIKTOK_COLORS.surface }}
        />
      );
    }
    return editingId === beer.id ? (
      <TextField
        value={editedBeer[key] ?? ''}
        onChange={e => setEditedBeer({ ...editedBeer, [key]: e.target.value })}
        size="small"
        style={{ background: TIKTOK_COLORS.surface, borderRadius: 4 }}
      />
    ) : (
      <span style={{ color: TIKTOK_COLORS.text }}>{beer[key]}</span>
    );
  };

  // Get keys, including 'rating'
  const keys = beers.length > 0
    ? Object.keys(beers[0]).filter(k => k !== 'id')
    : ['name', 'price', 'rating', 'image']; // fallback keys

  return (
    <div style={{
      padding: 20,
      minHeight: '100vh',
      background: TIKTOK_COLORS.background
    }}>
      {/* Top Bar */}
      <BeerTopBar type={type} setType={setType} />
      <div
        ref={containerRef}
        style={{
          height: 500,
          overflowY: 'auto',
          borderRadius: 8,
          background: TIKTOK_COLORS.surface,
          border: `1px solid ${TIKTOK_COLORS.border}`,
          boxShadow: '0 2px 16px 0 #0004'
        }}
      >
        <TableContainer component={Paper} style={{ background: TIKTOK_COLORS.surface }}>
          <Table>
            <TableHead>
              <TableRow>
                {keys.map(key => (
                  <TableCell
                    key={key}
                    style={{
                      color: TIKTOK_COLORS.blue,
                      fontWeight: 700,
                      background: TIKTOK_COLORS.surface,
                      borderBottom: `2px solid ${TIKTOK_COLORS.accent}`
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableCell>
                ))}
                <TableCell
                  style={{
                    color: TIKTOK_COLORS.blue,
                    fontWeight: 700,
                    background: TIKTOK_COLORS.surface,
                    borderBottom: `2px solid ${TIKTOK_COLORS.accent}`
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beers.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={keys.length + 1} align="center" style={{ color: TIKTOK_COLORS.textSecondary }}>
                    No data found.
                  </TableCell>
                </TableRow>
              )}
              {beers.map(beer => (
                <TableRow key={beer.id} style={{ background: TIKTOK_COLORS.background }}>
                  {keys.map(key => (
                    <TableCell key={key} style={{ color: TIKTOK_COLORS.text }}>
                      {renderCell(beer, key)}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editingId === beer.id ? (
                      <IconButton onClick={() => handleSave(beer.id)} style={{ color: TIKTOK_COLORS.blue }}>
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleEdit(beer)} style={{ color: TIKTOK_COLORS.accent }}>
                        <Edit />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDelete(beer.id)} style={{ color: TIKTOK_COLORS.accent }}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={keys.length + 1} align="center">
                    <CircularProgress size={24} style={{ color: TIKTOK_COLORS.accent }} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default beersTable;