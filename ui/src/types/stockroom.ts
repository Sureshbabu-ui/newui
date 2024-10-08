import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface StockRoomCreate {
    RoomName: string;
    RoomCode: string | null;
    IsActive: number;
    Description: string;
}

export interface StockRoomCreateResponse {
    IsStockRoomCreated: Boolean;
}

export const createDecoder: Decoder<StockRoomCreateResponse> = object({
    IsStockRoomCreated: boolean,
});

export interface StockRoomEdit {
    RoomName: string;
    Id: number;
    IsActive: string;
    Description: string;
}

export interface StockRoomUpdateResponse {
    IsStockRoomUpdated: Boolean;
}

export const updateRoomDecoder: Decoder<StockRoomUpdateResponse> = object({
    IsStockRoomUpdated: boolean,
});

export interface StockRoomDetails {
    Id: number;
    RoomName: string;
    RoomCode: string;
    IsActive: boolean;
    Description: string;
}

export const stockRoomDetailsDecoder: Decoder<StockRoomDetails> = object({
    Id: number,
    RoomName: string,
    RoomCode: string,
    IsActive: boolean,
    Description: string,
});
export interface StockRoomList {
    StockRooms: StockRoomDetails[],
    TotalRows: number;
}

export const stockRoomListDecoder: Decoder<StockRoomList> = object({
    StockRooms: array(stockRoomDetailsDecoder),
    TotalRows: number
});

export interface StockRoomNames {
    Id: number;
    RoomName: string;
}

export const StockRoomNamesDecoder: Decoder<StockRoomNames> = object({
    Id: number,
    RoomName: string
});

export interface StockRoomNamesList {
    StockRooms: StockRoomNames[],
}

export const stockRoomNamesListDecoder: Decoder<StockRoomNamesList> = object({
    StockRooms: array(StockRoomNamesDecoder),
});

export interface StockRoomDeleted {
    IsDeleted: Boolean;
}

export const stockRoomDeletedDecoder: Decoder<StockRoomDeleted> = object({
    IsDeleted: boolean,
});