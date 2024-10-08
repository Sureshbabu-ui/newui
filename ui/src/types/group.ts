import { Decoder, array, boolean, nullable, number, object, string } from "decoders";
////for listing group for notification settings
 export interface GroupDetail {
    Id: number;
    Name: string;
  }
  
  export const groupDetailDecoder: Decoder<GroupDetail> = object({
    Id: number,
    Name: string,
  });
  
  export interface GroupNames {
    GroupTitle: GroupDetail[];
  }
  
  export const groupNameDecoder: Decoder<GroupNames> = object({
    GroupTitle: array(groupDetailDecoder),
  }); 