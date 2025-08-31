export type RoomType = "office" | "meeting" | "bathroom" | "constructionPad";

export type RoomCell = {
  id: string;
  type: RoomType;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
};

export type Floor = {
  id: string;
  y: number;
  rooms: RoomCell[];
};

export type BuildingSchema = {
  id: string;
  name: string;
  floors: Floor[];
  floorHeight: number;
};

export const B1_SCHEMA: BuildingSchema = {
  id: "B1",
  name: "Starter Perch Plaza",
  floorHeight: 180, // design px from one floor's tiles to the next
  floors: [
    {
      id: "F1",
      y: 0,
      rooms: [
        { id: "office-1", type: "office", x: 0, y: 0, w: 6, h: 4, label: "Office 1" },
        { id: "office-2", type: "office", x: 6, y: 0, w: 6, h: 4, label: "Office 2" },
        { id: "pad-3", type: "constructionPad", x: 12, y: 0, w: 6, h: 4, label: "+ 1.0K" },
      ],
    },
  ],
};

export const B2_SCHEMA: BuildingSchema = {
  id: "B2",
  name: "Open Nest Annex",
  floorHeight: 180,
  floors: [
    {
      id: "F1",
      y: 0,
      rooms: [
        { id: "office-1", type: "office", x: 0, y: 0, w: 6, h: 4, label: "Office 1" },
        { id: "office-2", type: "office", x: 6, y: 0, w: 6, h: 4, label: "Office 2" },
        { id: "office-3", type: "office", x: 12, y: 0, w: 6, h: 4, label: "Office 3" },
      ],
    },
    {
      id: "F2",
      y: 1,
      rooms: [
        { id: "meeting-1", type: "meeting", x: 3, y: 0, w: 8, h: 5, label: "Meeting Perch" },
        { id: "bathroom-1", type: "bathroom", x: 12, y: 0, w: 4, h: 3, label: "Bathroom" },
      ],
    },
  ],
};

export const BUILDING_SCHEMAS: Record<string, BuildingSchema> = {
  b1: B1_SCHEMA,
  b2: B2_SCHEMA,
};