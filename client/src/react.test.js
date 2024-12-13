import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Banner from './components/banner'; // Adjust path as necessary

test('Create Post button is disabled for guests', () => {
    // Render Banner in guest mode
    render(<Banner mode="newPost" userMode="guest" />);
    
    // Find the button and check if it's disabled
    const guestButton = screen.getByRole('button', { name: /create post/i });
    expect(guestButton).toBeDisabled();
});

test('Create Post button is enabled for registered users', () => {
    // Render Banner in user mode
    render(<Banner mode="newPost" userMode="user" />);
    
    // Find the button and check if it's enabled
    const userButton = screen.getByRole('button', { name: /create post/i });
    expect(userButton).toBeEnabled();
});
