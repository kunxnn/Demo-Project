'use client';
import React, { useEffect, useState } from 'react';

//mui
import { Box, Tab, Grid, Typography, TextField, MenuItem, Stack, Button, CircularProgress, Backdrop, Table, TableHead, TableRow, TableCell, TableBody, } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

//ui shadcn components
import { PageHeader } from "../../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


//icon
import { Icon } from '@iconify/react';

export default function Queue() {

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="หน้าหลัก" breadcrumbs={[{ label: "หน้าหลัก" }]} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card className="col-span-4">

    
        </Card>
      </div>
    </div>
  )
}



