const { main } = require("./index");

jest.mock("@actions/core");
jest.mock("notifications-node-client");

const core = require("@actions/core");
const NotifyClient = require("notifications-node-client").NotifyClient;

const { when } = require("jest-when");

const mockEmail = jest.fn();
const mockSms = jest.fn();

NotifyClient.mockImplementation(() => {
  return {
    sendEmail: mockEmail,
    sendSms: mockSms,
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("main", () => {
  test("should fail if an unsupported message type is provided", () => {
    setInputs(
      "api-key",
      "api-endpoint",
      "unsupported",
      "{}",
      "recipient",
      "template-id",
      "reference"
    );
    main();
    expect(core.setFailed).toHaveBeenCalledWith(
      "Message type: unsupported not supported"
    );
  });

  test("should send an email if the message type is email", () => {
    setInputs(
      "api-key",
      "api-endpoint",
      "email",
      "{}",
      "recipient",
      "template-id",
      "reference"
    );
    mockEmail.mockResolvedValueOnce("reference");
    main();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(mockEmail).toHaveBeenCalledWith(
      "template-id",
      "recipient",
      {},
      "reference"
    );
  });

  test("should send an sms if the message type is sms", () => {
    setInputs(
      "api-key",
      "api-endpoint",
      "sms",
      "{}",
      "recipient",
      "template-id",
      "reference"
    );
    mockSms.mockResolvedValueOnce("reference");
    main();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(mockSms).toHaveBeenCalledWith(
      "template-id",
      "recipient",
      {},
      "reference"
    );
  });

  test("should fail if the personalisation is not valid json", () => {
    setInputs(
      "api-key",
      "api-endpoint",
      "sms",
      "{",
      "recipient",
      "template-id",
      "reference"
    );
    main();
    expect(core.setFailed).toHaveBeenCalled;
  });

  test("should set a reference if one is not provided", () => {
    setInputs(
      "api-key",
      "api-endpoint",
      "sms",
      "{}",
      "recipient",
      "template-id"
    );
    mockSms.mockResolvedValueOnce("reference");
    main();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(mockSms).toHaveBeenCalledWith(
      "template-id",
      "recipient",
      {},
      expect.any(String)
    );
  });

  test("should set a reference if one is provided but is empty", () => {
    setInputs(
      "api-key",
      "api-endpoint",
      "sms",
      "{}",
      "recipient",
      "template-id",
      ""
    );
    mockSms.mockResolvedValueOnce("reference");
    main();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(mockSms).toHaveBeenCalledWith(
      "template-id",
      "recipient",
      {},
      expect.any(String)
    );
  });

  test("should fail if the email fails to send", () => {
    setInputs(
      "api-key",
      "api-endpoint",
      "email",
      "{}",
      "recipient",
      "template-id",
      "reference"
    );
    mockEmail.mockRejectedValueOnce("error");
    main();
    expect(core.setFailed).toHaveBeenCalled;
  });

  test("should fail if the sms fails to send", () => {
    setInputs(
      "api-key",
      "api-endpoint",
      "sms",
      "{}",
      "recipient",
      "template-id",
      "reference"
    );
    mockSms.mockRejectedValueOnce("error");
    main();
    expect(core.setFailed).toHaveBeenCalled;
  });
});

const setInputs = (
  apiKey,
  apiEndpoint,
  messageType,
  personalisation,
  recipient,
  templateId,
  reference
) => {
  when(core.getInput).calledWith("api-key").mockReturnValueOnce(apiKey);
  when(core.getInput)
    .calledWith("api-endpoint")
    .mockReturnValueOnce(apiEndpoint);
  when(core.getInput)
    .calledWith("message-type")
    .mockReturnValueOnce(messageType);
  when(core.getInput)
    .calledWith("personalisation")
    .mockReturnValueOnce(personalisation);
  when(core.getInput).calledWith("recipient").mockReturnValueOnce(recipient);
  when(core.getInput).calledWith("template-id").mockReturnValueOnce(templateId);
  when(core.getInput).calledWith("reference").mockReturnValueOnce(reference);
};
