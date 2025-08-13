"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { Box, Button, Container, TextField, Typography, Paper, InputAdornment, IconButton, Avatar, ThemeProvider, createTheme, } from "@mui/material"
import { Visibility, VisibilityOff, Lock, AccountBox, LockOutlined } from "@mui/icons-material"
import Swal from 'sweetalert2';
import {
  FacebookAuthProvider,
  signInWithPopup,
  getIdToken,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-bai-jamjuree)",
    allVariants: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-bai-jamjuree)",
          fontWeight: 500,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-bai-jamjuree)",
        },
      },
    },
  },
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter();
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }


  const submitlogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const result = await res.json()
      if (res.ok && result.code === 200) {
        await Swal.fire({
          icon: result.status,
          title: result.title,
          showConfirmButton: false,
          timer: 1300,
          timerProgressBar: true,
        });

        Swal.fire({
          title: 'โปรดรอสักครู่ ....',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
          showConfirmButton: false,
        });

        setTimeout(() => {
          Swal.close();
          router.push('/patient');
        }, 1000);
      } else {
        Swal.fire({
          icon: result.status,
          title: result.message,
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
      alert('fetch Failed: ' + error);
    }
  };


  // const handleFacebookLogin = () => {
  //   const clientId = process.env.NEXT_PUBLIC_FB_APP_ID!;
  //   const redirectUri = 'http://localhost:3333/auth/facebook/callback';
  //   const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email,public_profile`;
  //   window.location.href = facebookAuthUrl;
  // };


  // const handleFacebookLogin = async () => {
  //   try {
  //     const provider = new FacebookAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     const token = await getIdToken(result.user);

  //     const res = await fetch('http://localhost:3306/auth/firebase-login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ token }),
  //     });

  //     const data = await res.json();
  //     console.log('✅ Facebook user info:', data);
  //   } catch (err) {
  //     console.error('❌ Facebook login error:', err);
  //   }
  // };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '100vh',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={20}
            sx={{
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlined sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 1,
                }}
              >
                เข้าสู่ระบบ
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                ยินดีต้อนรับกลับมา! กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
              </Typography>
            </Box>

            <Box component="form" onSubmit={submitlogin}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="Username"
                label="Username"
                name="Username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBox color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background: "#2979ff",
                  "&:hover": {
                    background: "#00b0ff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                เข้าสู่ระบบ
              </Button>


            </Box>
            {/* <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleFacebookLogin}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "#2979ff",
                "&:hover": {
                  background: "#00b0ff",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              ทดสอบ Login facebook
            </Button> */}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
