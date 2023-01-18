import ProductHeroLayout from "../layouts/HeroLayout";

const Home = () => {
  return (
    <div>
      <ProductHeroLayout
        sxBackground={{
          backgroundImage: `url(https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)`,
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export default Home;
