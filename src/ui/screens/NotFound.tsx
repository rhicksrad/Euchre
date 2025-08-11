import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="grid place-items-center py-20 text-center">
      <div>
        <h1 className="text-3xl font-bold">404</h1>
        <p className="opacity-80 mb-4">That trail seems closed.</p>
        <Link to="/" className="text-lodge-lake underline">Return to lodge</Link>
      </div>
    </div>
  );
}


