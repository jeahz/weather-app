import WeatherBoard from "../components/WeatherBoard/WeatherBoard";

export default function Home({ data }) {
  return (
    <>
      <WeatherBoard data={data} />
    </>
  )
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=jakarta&appid=86b521835e41cf3a0efc70d5bffba48e`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
