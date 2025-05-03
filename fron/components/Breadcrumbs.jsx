import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';

const Breadcrumbs = ({ path, setSelectedFileId }) => {
  return (
    <MuiBreadcrumbs aria-label="breadcrumb" separator="›" sx={{ color: '#666' }}>
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        return isLast ? (
          <Typography key={item.id} sx={{ color: '#333', fontSize: '0.875rem' }}>
            {item.name}
          </Typography>
        ) : (
          <Link
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedFileId(item.id);
            }}
            sx={{
              color: '#1976d2',
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {item.name}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;