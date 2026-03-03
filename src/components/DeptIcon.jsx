"use client";

import {
  Heart,
  Scissors,
  Baby,
  PersonStanding,
  Bone,
  Eye,
  Ear,
  Droplets,
} from "lucide-react";

const iconMap = {
  "Internal Medicine": Heart,
  "Surgery": Scissors,
  "Pediatrics": Baby,
  "OB-GYN": PersonStanding,
  "Orthopedics": Bone,
  "Ophthalmology": Eye,
  "ENT": Ear,
  "Dermatology": Droplets,
};

export default function DeptIcon({ department, size = 20, color, ...props }) {
  const Icon = iconMap[department];
  if (!Icon) return null;
  return <Icon size={size} color={color} {...props} />;
}
