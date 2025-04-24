package ditod.conduit.exception;

public class EntityDoesNotExistException extends RuntimeException {
    public EntityDoesNotExistException() {
        super("Not Found");
    }

    public EntityDoesNotExistException(String entity, String fieldName, String fieldDescriptor) {
        super("No " + entity + " exists with this " + fieldName + ": " + fieldDescriptor + ".");
    }

    public EntityDoesNotExistException(String entity, Integer id) {
        super("No " + entity + " exists with this id:" + id);
    }
}