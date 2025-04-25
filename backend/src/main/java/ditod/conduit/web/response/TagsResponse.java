package ditod.conduit.web.response;

import ditod.conduit.core.model.tag.Tag;

import java.util.Collection;

public record TagsResponse(String[] tags) {
    public TagsResponse(Collection<Tag> tags) {
        this(tags.stream().map(Tag::getName).toArray(String[]::new));
    }
}