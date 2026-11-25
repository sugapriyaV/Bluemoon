import { Crown, Dices, Spade, Puzzle, Trophy, Trees, Flame, Waves, Blocks, Baby, Smile, Wifi, Tv, Snowflake, Armchair, Dumbbell } from 'lucide-react'

export const AMENITY_GROUPS = [
  { title: 'Indoor Games', icon: Dices, items: [
    { name: 'Chess', icon: Crown }, { name: 'Carrom Board', icon: Trophy }, { name: 'Board Games', icon: Puzzle }, { name: 'Playing Cards', icon: Spade } ] },
  { title: 'Outdoor Games', icon: Waves, items: [
    { name: 'Cricket Bat & Ball', icon: Dumbbell }, { name: 'Badminton', icon: Trophy }, { name: 'Outdoor Play Area', icon: Trees }, { name: 'BBQ Facilities', icon: Flame }, { name: 'Swimming Pool', icon: Waves } ] },
  { title: "Kids' Play Area", icon: Baby, items: [
    { name: "Kids' Toys", icon: Smile }, { name: 'Soft Toys', icon: Baby }, { name: 'Building Blocks', icon: Blocks }, { name: 'Indoor Play Activities', icon: Puzzle } ] },
  { title: 'Comfort & Facilities', icon: Armchair, items: [
    { name: 'Free Wi-Fi', icon: Wifi }, { name: 'Television (TV)', icon: Tv }, { name: 'Air Conditioning', icon: Snowflake }, { name: 'Comfortable Seating', icon: Armchair } ] }
]
