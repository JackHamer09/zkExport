const errors = {
  INVALID_ADDRESS_INPUTTED: "Please, input a valid address in the address field above",
  INVALID_TX_START_HASH_INPUTTED: `Please, input a valid "start from" transaction hash in the field above`,
  INVALID_TX_FINISH_HASH_INPUTTED: `Please, input a valid "finish at" transaction hash in the field above`,
  INVALID_MAX_TX_INPUTTED: `Please, input a valid max amount of transactions in the field above`,
  INVALID_START_DATE_TIME_INPUTTED: `Please, select a valid "start from" date time in the field above`,
  INVALID_FINISH_DATE_TIME_INPUTTED: `Please, select a valid "finish at" date time in the field above`,
  INVALID_BLOCK_ID_INPUTTED: `Please, input a valid block id in the field above`,
  ZERO_FIELDS_INPUTTED: "Please, select at least one field to export",
  ERROR_REQUESTING_TOKENS_INFORMATION:
    "We were not able to request tokens information. Please, check your internet connection or try again later.",
};
type ErrorKey = keyof typeof errors;
export default (name: ErrorKey) => errors[name];
