'use client';
import React from 'react';

//mui
import {
  Box,
  Tab,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

//ui shadcn components
import { PageHeader } from "../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

//component
import QueueSettingPatient from "../components/queue/queue_setting_patient"
import Treatmentstages from "../components/queue/treatment_stages"
import Historyqueue from "../components/queue/history_queue"

//icons
import { Icon } from '@iconify/react';

export default function Queue() {

  const [value, setValue] = React.useState('1');
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="หน้าหลัก" breadcrumbs={[{ label: "หน้าหลัก" }]} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

        <Card className="col-span-4 shadow-lg rounded-xl overflow-hidden">
          {/* Header สวย ๆ พร้อม Gradient */}
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6">
            <CardTitle className="text-center text-3xl font-bold flex items-center justify-center gap-3">
              <Icon icon="solar:settings-bold" width={36} height={36} />
              ตั้งค่าระบบคิวติดตามสถานะผู้ป่วย
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <Box sx={{ width: '100%' }}>
              <TabContext value={value}>
                <TabList
                  onChange={handleChange}
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    "& .MuiTab-root": {
                      fontWeight: "bold",
                      fontSize: "1rem",
                      gap: 1,
                      minHeight: 56
                    }
                  }}
                >
                  <Tab
                    icon={<Icon icon="mdi:account-settings" width={20} height={20} />}
                    label="ตั้งค่าคิวผู้ป่วย"
                    value="1"
                  />
                  <Tab
                    icon={<Icon icon="mdi:clipboard-list" width={20} height={20} />}
                    label="จัดการขั้นตอน"
                    value="2"
                  />
                  <Tab
                    icon={<Icon icon="mdi:history" width={20} height={20} />}
                    label="ประวัติคิว"
                    value="3"
                  />
                </TabList>

                <TabPanel value="1">
                  <QueueSettingPatient />
                </TabPanel>
                <TabPanel value="2">
                  <Treatmentstages />
                </TabPanel>
                <TabPanel value="3">
                  <Historyqueue />
                </TabPanel>
              </TabContext>
            </Box>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
