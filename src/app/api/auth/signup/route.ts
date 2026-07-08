import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { readData, writeData } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const users = readData('users.json');

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user', // Default role
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData('users.json', users);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
