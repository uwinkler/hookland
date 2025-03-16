import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Layout } from "../Layout";
import { RandomGameAppBar } from "../AppBar/RandomGameAppBar";

export function TopUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ amount: number }>();

  const onSubmit = (data: { amount: number }) => {
    alert(`Successfully topped up €${data.amount}`);
    reset(); // Reset form after submission
  };

  return (
    <Layout>
      <RandomGameAppBar />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Top-Up Balance
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Amount (€)"
              type="number"
              variant="outlined"
              fullWidth
              {...register("amount", {
                required: "Amount is required",
                min: { value: 100, message: "Amount must be at least 100 €" },
              })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Top Up
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  );
}

