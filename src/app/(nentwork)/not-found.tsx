'use client';
 
import Error from 'next/error';
 
export default function NotFound() {
  return (
    <div>
      <div>
        <Error statusCode={404} />
      </div>
    </div>
  );
}