import { useState } from 'react';

export const useSpreadsheetData = () => {
  return {
    data: [],
    loading: false,
    error: null
  };
};