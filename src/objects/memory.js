msngr.extend((function(external, internal) {
    "use strict";

    internal.objects = internal.objects || {};
    internal.objects.memory = function() {

        // Index for id to message objects
        var id_to_message = {};

        // Direct index (no partials) for message
        var direct_index = {
            topic_to_id: {},
            topic_cat_to_id: {},
            topic_scat_to_id: {},
            topic_cat_scat_to_id: {}
        };

        // Message index count
        var index_count = 0;

        var mem = {
            index: function(message) {
                if (external.exist(message) && external.exist(message.topic)) {
                    var uuid = external.id();
                    id_to_message[uuid] = message;

                    if (direct_index.topic_to_id[message.topic] === undefined) {
                        direct_index.topic_to_id[message.topic] = [];
                    }
                    direct_index.topic_to_id[message.topic].push(uuid);

                    if (external.exist(message.category)) {
                        if (direct_index.topic_cat_to_id[message.topic] === undefined) {
                            direct_index.topic_cat_to_id[message.topic] = {};
                        }

                        if (direct_index.topic_cat_to_id[message.topic][message.category] === undefined) {
                            direct_index.topic_cat_to_id[message.topic][message.category] = [];
                        }

                        direct_index.topic_cat_to_id[message.topic][message.category].push(uuid);
                    }

                    if (external.exist(message.subcategory)) {
                        if (direct_index.topic_scat_to_id[message.topic] === undefined) {
                            direct_index.topic_scat_to_id[message.topic] = {};
                        }

                        if (direct_index.topic_scat_to_id[message.topic][message.subcategory] === undefined) {
                            direct_index.topic_scat_to_id[message.topic][message.subcategory] = [];
                        }

                        direct_index.topic_scat_to_id[message.topic][message.subcategory].push(uuid);
                    }

                    if (external.exist(message.category) && external.exist(message.subcategory)) {
                        if (direct_index.topic_cat_scat_to_id[message.topic] === undefined) {
                            direct_index.topic_cat_scat_to_id[message.topic] = {};
                        }

                        if (direct_index.topic_cat_scat_to_id[message.topic][message.category] === undefined) {
                            direct_index.topic_cat_scat_to_id[message.topic][message.category] = {};
                        }

                        if (direct_index.topic_cat_scat_to_id[message.topic][message.category][message.subcategory] === undefined) {
                            direct_index.topic_cat_scat_to_id[message.topic][message.category][message.subcategory] = [];
                        }

                        direct_index.topic_cat_scat_to_id[message.topic][message.category][message.subcategory].push(uuid);
                    }

                    index_count++;

                    return uuid;
                }
                return undefined;
            },
            delete: function(uuid) {
                if (external.exist(uuid) && external.exist(id_to_message[uuid])) {
                    var message = id_to_message[uuid];

                    if (external.exist(message.topic)) {
                        external.removeFromArray(direct_index.topic_to_id[message.topic], uuid);

                        if (external.exist(message.category)) {
                            external.removeFromArray(direct_index.topic_cat_to_id[message.topic][message.category], uuid);
                        }

                        if (external.exist(message.subcategory)) {
                            external.removeFromArray(direct_index.topic_scat_to_id[message.topic][message.subcategory], uuid);
                        }

                        if (external.exist(message.category) && external.exist(message.subcategory)) {
                            external.removeFromArray(direct_index.topic_cat_scat_to_id[message.topic][message.category][message.subcategory], uuid);
                        }
                    }

                    delete id_to_message[uuid];
                    index_count--;

                    return true;
                }
                return false;
            },
            query: function(message) {
                if (external.exist(message)) {
                    if (external.exist(message.topic)) {
                        // Topic Only Results
                        if (!external.exist(message.category) && !external.exist(message.subcategory)) {
                            return direct_index.topic_to_id[message.topic] || [];
                        }

                        // Topic + Category Results
                        if (external.exist(message.category) && !external.exist(message.subcategory)) {
                            return (direct_index.topic_cat_to_id[message.topic] || {})[message.category] || [];
                        }

                        // Topic + Data Type Results
                        if (external.exist(message.subcategory) && !external.exist(message.category)) {
                            return (direct_index.topic_scat_to_id[message.topic] || {})[message.subcategory] || [];
                        }

                        // Topic + Category + Data Type Results
                        if (external.exist(message.category) && external.exist(message.subcategory)) {
                            return ((direct_index.topic_cat_scat_to_id[message.topic] || {})[message.category] || {})[message.subcategory] || [];
                        }
                    }
                }

                return [];
            },
            clear: function() {
                // Index for id to message objects
                id_to_message = {};

                // Direct index (no partials) for message
                direct_index = {
                    topic_to_id: {},
                    topic_cat_to_id: {},
                    topic_scat_to_id: {},
                    topic_cat_scat_to_id: {}
                };

                index_count = 0;

                return true;
            }
        };

        Object.defineProperty(mem, "count", {
            get: function() {
                return index_count;
            }
        });

        return mem;
    };

    // This is an internal extension; do not export explicitly.
    return {};
}));
