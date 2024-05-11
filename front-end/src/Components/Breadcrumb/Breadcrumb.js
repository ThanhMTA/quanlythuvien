import React from 'react';
import { Breadcrumbs, Link, Typography, listItemClasses } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import {useLocation} from "react-router-dom";

const breadcrumbItems = [
  { label: 'Trang chủ', url: '/' },
  { label: 'Kho sách', url: '/book' },
  { label: 'Chi tiết đầu sách', url: '/book/1' },
];


const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbItems.map((item, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = item.url === pathnames.length - 1;

        return isLast ? (
          <Typography key={item.url} color="text.primary">{item.label}</Typography>
        ) : (
          <Link key={item.url} to={routeTo}>{item.label}</Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
