import pebbles from "./pebbles.json";

export function Pebbles() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Pebbles</h1>
      <ul>
        {pebbles.map((pebble) => (
          <li key={pebble.filePath} >
            <a href={`/pebble/${pebble.functionName}`}>{pebble.functionName}</a>
            {/* <pre>{pebble.doc}</pre> */}
          </li>
        ))}
      </ul>
    </div>
  );
}