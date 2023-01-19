import { ReactNode } from "react";
import PropTypes from "prop-types";
import styled from "@mui/material/styles/styled";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const ProductHeroLayoutRoot = styled("section")(({ theme }) => ({
  color: theme.palette.common.white,
  position: "relative",
  display: "flex",
  alignItems: "center",
  height: "80vh",
  [theme.breakpoints.up("sm")]: {
    minHeight: 500,
    maxHeight: 1300,
  },
}));

const Background = styled(Box)({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: -2,
});

interface HeroProps {
  sxBackground?: { backgroundImage: string; backgroundPosition: string };
  children?: ReactNode;
}

function ProductHeroLayout(props: HeroProps) {
  const { sxBackground, children } = props;

  return (
    <ProductHeroLayoutRoot>
      <Card raised={true} sx={{ maxWidth: "23rem", ml: 9 }}>
        <CardContent sx={{ backgroundColor: "#121212" }}>
          <Typography variant="h3" sx={{ color: "#fff" }}>
            Global Custody Services
          </Typography>
          <br />
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Safekeeping your assets and market operations with precision and
            reliability.
          </Typography>
          <br />
          <Typography variant="body2" sx={{ color: "#fff" }}>
            We bring innovative, scalable and automated solutions to our
            clients, with a laser focus on reliability, stability and
            accountability.
          </Typography>
        </CardContent>
      </Card>
      <Container
        sx={{
          mt: 3,
          mb: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            // backgroundColor: 'common.black',
            opacity: 0.5,
            zIndex: -1,
          }}
        />
        <Background sx={sxBackground} />
      </Container>
    </ProductHeroLayoutRoot>
  );
}

ProductHeroLayout.propTypes = {
  children: PropTypes.node,
  sxBackground: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default ProductHeroLayout;
