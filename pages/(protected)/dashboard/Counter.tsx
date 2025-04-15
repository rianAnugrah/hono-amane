import { useCounterStore } from "@/stores/counter"


export default function Counter() {
  const { count, increment } = useCounterStore()
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Tambah</button>
    </div>
  )
}
