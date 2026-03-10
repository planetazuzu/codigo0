export interface BroselowZone {
  id: string;
  colorName: string;
  colorHex: string;
  lengthMinCm: number;
  lengthMaxCm: number;
  weightMinKg: number;
  weightMaxKg: number;
  equipment: {
    ettUncuffed: string;
    ettCuffed: string;
    laryngoscopeBlade: string;
    suctionCatheter: string;
    ivCatheter: string;
  };
}

export const broselowZones: BroselowZone[] = [
  {
    id: 'grey',
    colorName: 'Gris',
    colorHex: '#9CA3AF',
    lengthMinCm: 46,
    lengthMaxCm: 59,
    weightMinKg: 3,
    weightMaxKg: 5,
    equipment: {
      ettUncuffed: '3.0',
      ettCuffed: '3.0',
      laryngoscopeBlade: '0',
      suctionCatheter: '6-8 Fr',
      ivCatheter: '24G',
    },
  },
  {
    id: 'pink',
    colorName: 'Rosa',
    colorHex: '#F9A8D4',
    lengthMinCm: 60,
    lengthMaxCm: 66,
    weightMinKg: 5,
    weightMaxKg: 6,
    equipment: {
      ettUncuffed: '3.5',
      ettCuffed: '3.0',
      laryngoscopeBlade: '1',
      suctionCatheter: '8 Fr',
      ivCatheter: '24G',
    },
  },
  {
    id: 'red',
    colorName: 'Rojo',
    colorHex: '#F87171',
    lengthMinCm: 67,
    lengthMaxCm: 74,
    weightMinKg: 6,
    weightMaxKg: 8,
    equipment: {
      ettUncuffed: '3.5-4.0',
      ettCuffed: '3.5',
      laryngoscopeBlade: '1',
      suctionCatheter: '8 Fr',
      ivCatheter: '22G',
    },
  },
  {
    id: 'purple',
    colorName: 'Púrpura',
    colorHex: '#A78BFA',
    lengthMinCm: 75,
    lengthMaxCm: 84,
    weightMinKg: 8,
    weightMaxKg: 10,
    equipment: {
      ettUncuffed: '4.0',
      ettCuffed: '3.5',
      laryngoscopeBlade: '1',
      suctionCatheter: '8-10 Fr',
      ivCatheter: '22G',
    },
  },
  {
    id: 'yellow',
    colorName: 'Amarillo',
    colorHex: '#FACC15',
    lengthMinCm: 85,
    lengthMaxCm: 94,
    weightMinKg: 10,
    weightMaxKg: 12,
    equipment: {
      ettUncuffed: '4.5',
      ettCuffed: '4.0',
      laryngoscopeBlade: '2',
      suctionCatheter: '10 Fr',
      ivCatheter: '22G',
    },
  },
  {
    id: 'white',
    colorName: 'Blanco',
    colorHex: '#E5E7EB',
    lengthMinCm: 95,
    lengthMaxCm: 104,
    weightMinKg: 12,
    weightMaxKg: 14,
    equipment: {
      ettUncuffed: '5.0',
      ettCuffed: '4.5',
      laryngoscopeBlade: '2',
      suctionCatheter: '10 Fr',
      ivCatheter: '20-22G',
    },
  },
  {
    id: 'blue',
    colorName: 'Azul',
    colorHex: '#60A5FA',
    lengthMinCm: 105,
    lengthMaxCm: 114,
    weightMinKg: 14,
    weightMaxKg: 18,
    equipment: {
      ettUncuffed: '5.5',
      ettCuffed: '5.0',
      laryngoscopeBlade: '2',
      suctionCatheter: '12 Fr',
      ivCatheter: '20G',
    },
  },
  {
    id: 'orange',
    colorName: 'Naranja',
    colorHex: '#FDBA74',
    lengthMinCm: 115,
    lengthMaxCm: 124,
    weightMinKg: 18,
    weightMaxKg: 23,
    equipment: {
      ettUncuffed: '6.0',
      ettCuffed: '5.5',
      laryngoscopeBlade: '3',
      suctionCatheter: '12 Fr',
      ivCatheter: '20G',
    },
  },
  {
    id: 'green',
    colorName: 'Verde',
    colorHex: '#4ADE80',
    lengthMinCm: 125,
    lengthMaxCm: 134,
    weightMinKg: 23,
    weightMaxKg: 29,
    equipment: {
      ettUncuffed: '6.5',
      ettCuffed: '6.0',
      laryngoscopeBlade: '3',
      suctionCatheter: '12-14 Fr',
      ivCatheter: '18-20G',
    },
  },
];
