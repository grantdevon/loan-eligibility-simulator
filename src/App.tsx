import { Alert, Box, CircularProgress } from '@mui/material';
import './App.css'
import { LoanForm } from './components/LoanForm/LoanForm'
import { useValidationRules } from './hooks/useValidationRules';

function App() {
  const { data, error, loading } = useValidationRules();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div className="App">
      {
        data && <LoanForm validationRules={data} />
      }
    </div>
  )
}

export default App
