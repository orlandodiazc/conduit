package ditod.conduit.web.response;

import ditod.conduit.core.model.tag.Tag;
import jakarta.validation.constraints.NotNull;

import java.util.Collection;

public record TagsResponse(@NotNull String[] tags) {
    public TagsResponse(Collection<Tag> tags) {
        this(tags.stream().map(Tag::getName).toArray(String[]::new));
    }
}