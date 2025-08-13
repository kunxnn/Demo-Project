"use client";
import { EncryptStorage } from 'encrypt-storage';

const SECRET_KEY = 'Hb3Ll$.Clb*B,Y?'; 

export const encryptStorage = new EncryptStorage(SECRET_KEY, {
  storageType: 'localStorage', 
});
