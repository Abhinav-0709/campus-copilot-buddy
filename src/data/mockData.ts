
// Mock data for campus-related responses
export const menuItems = [
  { name: 'Masala Dosa', price: 50, description: 'Crispy crepe with spiced potato filling', category: 'meals' },
  { name: 'Samosa', price: 15, description: 'Crispy pastry with spiced potato filling', category: 'snacks' },
  { name: 'Chai', price: 15, description: 'Indian spiced tea', category: 'beverages' },
  { name: 'Vada Pav', price: 25, description: 'Spicy potato patty in a bun', category: 'snacks' },
  { name: 'Fruit Bowl', price: 40, description: 'Fresh seasonal fruits', category: 'desserts' },
  { name: 'Maggi Noodles', price: 30, description: 'Instant noodles with vegetables', category: 'meals' },
  { name: 'Coffee', price: 20, description: 'Fresh brewed coffee', category: 'beverages' },
  { name: 'Paratha', price: 35, description: 'Stuffed flatbread', category: 'meals' },
  { name: 'Gulab Jamun', price: 20, description: 'Sweet milk-solid balls', category: 'desserts' },
  { name: 'Poha', price: 30, description: 'Flattened rice with spices', category: 'meals' }
];

export const mockResponses: Record<string, string> = {
  exams: "The next internal exams are scheduled for May 15-20, 2025. Make sure to check the department notice board for the exact schedule.",
  assignments: "You have 3 pending assignments:\n1. Data Structures project due tomorrow\n2. Economics essay due on Friday\n3. Physics lab report due next Monday",
  food: `Here are some popular food spots near campus:
• Campus Café - Budget-friendly meals (₹30-80)
• Dosa Corner - South Indian specials (₹40-100)
• Snack Shack - Quick bites (₹15-50)
• Juice Junction - Fresh beverages (₹20-60)`,
  events: "Upcoming campus events:\n• Tech Fest - April 30\n• Cultural Night - May 5\n• Career Fair - May 10",
  forms: "Common forms you might need:\n• KYC verification\n• Scholarship application\n• Hostel extension\n• Internship certification"
};
