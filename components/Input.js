export default function Input({ label, ref }) {
    return (
        <label>
            {label}
            <input ref={ref} />
      </label>
    );
}